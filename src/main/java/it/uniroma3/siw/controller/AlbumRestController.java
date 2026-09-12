package it.uniroma3.siw.controller;

import java.time.Year;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.model.Album;
import it.uniroma3.siw.model.Artista;
import it.uniroma3.siw.service.AlbumService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/albums")
@CrossOrigin(origins = "http://localhost:5173")
public class AlbumRestController {
	@Autowired
	private AlbumService albumService;

	@GetMapping
	public ResponseEntity<List<Album>> getAllAlbums() {
		List<Album> albums = this.albumService.findAll();
		return ResponseEntity.ok(albums);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Album> getAlbumById(@PathVariable Long id) {
		Album album = this.albumService.findById(id);

		if (album != null) {
			return ResponseEntity.ok(album);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping
	public ResponseEntity<Void> inserisciNuovoAlbum(@Valid @RequestBody Album album) {
		if (album.getAnno() > 0) {
			int annoAttuale = Year.now().getValue();
			if (album.getAnno() > annoAttuale) {
				return ResponseEntity.badRequest().build();
			}
		}

		this.albumService.save(album);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<Void> modificaAlbum(@PathVariable Long id, @Valid @RequestBody Album datiAggiornati) {
		Album albumEsistente = this.albumService.findById(id);

		if (albumEsistente == null) {
			return ResponseEntity.notFound().build();
		}
		if (datiAggiornati.getAnno() > 0) {
			int annoAttuale = Year.now().getValue();
			if (datiAggiornati.getAnno() > annoAttuale) {
				return ResponseEntity.badRequest().build();
			}
		}

		albumEsistente.setNome(datiAggiornati.getNome());
		albumEsistente.setAnno(datiAggiornati.getAnno());
		albumEsistente.setImgUrl(datiAggiornati.getImgUrl());
		albumEsistente.setAutore(datiAggiornati.getAutore()); 

		this.albumService.save(albumEsistente);

		return ResponseEntity.ok().build();
	}
	
	@DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminaAlbum(@PathVariable Long id) {
        Album albumEsistente = this.albumService.findById(id);
        if (albumEsistente == null) {
            return ResponseEntity.notFound().build(); 
        }
        this.albumService.delete(albumEsistente);
        
        return ResponseEntity.ok().build(); 
    }
}
